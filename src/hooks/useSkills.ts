import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Skill {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

export const useSkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSkills([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'skills'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Skill[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Skill);
      });
      setSkills(results);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'skills');
    });

    return () => unsubscribe();
  }, [user]);

  const addSkill = async (data: Omit<Skill, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'skills'), {
        ...data,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'skills');
    }
  };

  const updateSkill = async (id: string, data: Partial<Skill>) => {
    try {
      await updateDoc(doc(db, 'skills', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `skills/${id}`);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `skills/${id}`);
    }
  };

  return { skills, loading, addSkill, updateSkill, deleteSkill };
};
