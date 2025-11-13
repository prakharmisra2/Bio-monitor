// src/store/reactorStore.js

import { create } from 'zustand';

const useReactorStore = create((set) => ({
  // State
  selectedReactor: null,
  reactors: [],
  
  // Actions
  setSelectedReactor: (reactor) => set({ selectedReactor: reactor }),
  
  setReactors: (reactors) => set({ reactors }),
  
  addReactor: (reactor) => set((state) => ({
    reactors: [...state.reactors, reactor]
  })),
  
  updateReactor: (reactorId, updates) => set((state) => ({
    reactors: state.reactors.map(r => 
      r.reactor_id === reactorId ? { ...r, ...updates } : r
    )
  })),
  
  removeReactor: (reactorId) => set((state) => ({
    reactors: state.reactors.filter(r => r.reactor_id !== reactorId)
  })),
}));

export default useReactorStore;