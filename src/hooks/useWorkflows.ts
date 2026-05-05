import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface WorkflowStep {
  skillId: string;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

export const useWorkflows = () => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorkflows([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'workflows'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Workflow[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Workflow);
      });
      setWorkflows(results);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'workflows');
    });

    return () => unsubscribe();
  }, [user]);

  const addWorkflow = async (data: Omit<Workflow, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'workflows'), {
        ...data,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'workflows');
    }
  };

  const updateWorkflow = async (id: string, data: Partial<Workflow>) => {
    try {
      await updateDoc(doc(db, 'workflows', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `workflows/${id}`);
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'workflows', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `workflows/${id}`);
    }
  };

  return { workflows, loading, addWorkflow, updateWorkflow, deleteWorkflow };
};
