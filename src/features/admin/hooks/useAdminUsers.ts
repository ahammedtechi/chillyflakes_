import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deactivateAdminUser,
  activateAdminUser,
  forcePasswordReset,
  signOutAllSessions,
  softDeleteAdminUser,
  type AdminUserFilterParams,
} from '../../../api/admin';
import type { CreateAdminUserPayload, UpdateAdminUserPayload } from '../../../types/admin';

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const;

export function useAdminUsers(params?: AdminUserFilterParams) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, params],
    queryFn: () => getAdminUsers(params),
    staleTime: 15 * 1000,
  });
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'audit-log'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminUserPayload) => createAdminUser(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminUserPayload }) =>
      updateAdminUser(id, payload),
    onSuccess: invalidate,
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateAdminUser(id),
    onSuccess: invalidate,
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => activateAdminUser(id),
    onSuccess: invalidate,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => forcePasswordReset(id),
  });

  const signOutSessionsMutation = useMutation({
    mutationFn: (id: string) => signOutAllSessions(id),
  });

  const softDeleteMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      softDeleteAdminUser(id, reason),
    onSuccess: invalidate,
  });

  return {
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deactivateUser: deactivateMutation.mutateAsync,
    isDeactivating: deactivateMutation.isPending,
    activateUser: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,
    forcePasswordReset: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    signOutAllSessions: signOutSessionsMutation.mutateAsync,
    isSigningOutSessions: signOutSessionsMutation.isPending,
    softDeleteUser: softDeleteMutation.mutateAsync,
    isDeleting: softDeleteMutation.isPending,
  };
}
