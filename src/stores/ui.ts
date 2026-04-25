import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const loading = ref<boolean>(false);
  const error = ref<string>('');

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function setError(message: string) {
    error.value = message;
  }

  function clearError() {
    error.value = '';
  }

  return {
    loading,
    error,
    setLoading,
    setError,
    clearError,
  };
});
