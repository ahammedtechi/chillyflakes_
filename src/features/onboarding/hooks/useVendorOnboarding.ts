import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOnboardingDraft,
  saveOnboardingStep,
  submitOnboarding,
  getVendorStatus,
  lookupIfsc,
  checkSlugAvailability,
} from '../../../api/vendorOnboarding';
import type {
  OnboardingDraftResponse,
  StoreDetailsStepData,
  PickupAddressStepData,
  VerificationStepData,
  BankDetailsStepData,
  ReviewSubmitStepData,
  VendorStatusResponse,
  OnboardingSubmitResponse,
  IfscLookupResponse,
  SlugAvailabilityResponse,
} from '../../../types/onboarding';

export function useOnboardingDraft() {
  return useQuery<OnboardingDraftResponse>({
    queryKey: ['vendor', 'onboarding', 'draft'],
    queryFn: getOnboardingDraft,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function useSaveOnboardingStep() {
  const queryClient = useQueryClient();

  return useMutation<
    OnboardingDraftResponse,
    Error,
    {
      stepNumber: number;
      data:
      | StoreDetailsStepData
      | PickupAddressStepData
      | VerificationStepData
      | BankDetailsStepData
      | ReviewSubmitStepData;
    }
  >({
    mutationFn: ({ stepNumber, data }) => saveOnboardingStep(stepNumber, data),
    onSuccess: (updatedDraft) => {
      queryClient.setQueryData(['vendor', 'onboarding', 'draft'], updatedDraft);
    },
  });
}

export function useVendorStatus() {
  return useQuery<VendorStatusResponse>({
    queryKey: ['vendor', 'status'],
    queryFn: getVendorStatus,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

export function useSubmitOnboarding() {
  const queryClient = useQueryClient();

  return useMutation<OnboardingSubmitResponse, Error, void>({
    mutationFn: submitOnboarding,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vendor', 'status'] });
      void queryClient.invalidateQueries({ queryKey: ['vendor', 'onboarding', 'draft'] });
    },
  });
}

export function useIfscLookup() {
  return useMutation<IfscLookupResponse, Error, string>({
    mutationFn: (code: string) => lookupIfsc(code),
  });
}

export function useSlugAvailability() {
  return useMutation<SlugAvailabilityResponse, Error, string>({
    mutationFn: (slug: string) => checkSlugAvailability(slug),
  });
}
