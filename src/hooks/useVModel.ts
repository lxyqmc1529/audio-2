import { computed, ComputedRef } from 'vue';

export const useVModel = <T>(props: T, key: keyof T, emit): ComputedRef<any> => {
  const modelValue = computed({
    get: () => props[key],
    set: (newValue) => {
      emit(`update:${key}`, newValue);
    },
  });

  return modelValue;
};
