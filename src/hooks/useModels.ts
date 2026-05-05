import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Model {
  id: string;
  name: string;
  description: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'Custom';
  apiKey: string;
  baseUrl?: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

export const useModels = () => {
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setModels([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'models'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Model[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Model);
      });
      setModels(results);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'models');
    });

    return () => unsubscribe();
  }, [user]);

  const addModel = async (data: Omit<Model, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'models'), {
        ...data,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'models');
    }
  };

  const updateModel = async (id: string, data: Partial<Model>) => {
    try {
      await updateDoc(doc(db, 'models', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `models/${id}`);
    }
  };

  const deleteModel = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'models', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `models/${id}`);
    }
  };

  return { models, loading, addModel, updateModel, deleteModel };
};
