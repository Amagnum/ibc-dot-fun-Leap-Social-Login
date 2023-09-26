import { atom } from "recoil";

export const showCapsuleModelState = atom<boolean>({
  key: "show-capsule-modal-state",
  default: false,
});

export const capsuleState = atom<unknown>({
key: "capsule-state",
default: undefined
})
