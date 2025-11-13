// src/hooks/useReactorData.js

import { useQuery } from '@tanstack/react-query';
import * as dataApi from '../api/data';
import * as reactorApi from '../api/reactors';

export const useReactorData = (reactorId, dataType, options = {}) => {
  return useQuery({
    queryKey: ['reactorData', reactorId, dataType, options],
    queryFn: () => dataApi.getReactorData(reactorId, dataType, options),
    enabled: !!reactorId && !!dataType,
    refetchInterval: options.refetchInterval || false,
  });
};

export const useLatestData = (reactorId, dataType, count = 1) => {
  return useQuery({
    queryKey: ['latestData', reactorId, dataType, count],
    queryFn: () => dataApi.getLatestData(reactorId, dataType, count),
    enabled: !!reactorId && !!dataType,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useDashboardData = (reactorId) => {
  return useQuery({
    queryKey: ['dashboardData', reactorId],
    queryFn: () => dataApi.getDashboardData(reactorId),
    enabled: !!reactorId,
    refetchInterval: 30000,
  });
};

export const useReactorStatus = (reactorId) => {
  return useQuery({
    queryKey: ['reactorStatus', reactorId],
    queryFn: () => reactorApi.getReactorStatus(reactorId),
    enabled: !!reactorId,
    refetchInterval: 60000, // Refetch every minute
  });
};