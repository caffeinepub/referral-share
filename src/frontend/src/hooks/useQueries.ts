import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useIsRegistered() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isRegistered"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isRegistered();
      } catch (err) {
        toast.error("Gagal memeriksa status registrasi");
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      try {
        return await actor.getMyProfile();
      } catch (err) {
        toast.error("Gagal memuat profil");
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getLeaderboard();
      } catch (err) {
        toast.error("Gagal memuat leaderboard");
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegister() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referralCode: string | null) => {
      if (!actor) throw new Error("No actor");
      await actor.register(referralCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isRegistered"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: () => {
      toast.error("Registrasi gagal, coba lagi");
    },
  });
}
