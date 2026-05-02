from sorter import Sorter
from wordlist import WordList
from alphabet_comparator import AlphabetComparator

class QuickSorter(Sorter):
    def __init__(self):
        super().__init__("QuickSort")

    def sort(self, word_list: WordList, comparator: AlphabetComparator):
        words = word_list.words
        self._quick_sort_recursive(words, 0, len(words) - 1, comparator)

    def _partition(self, arr, low, high, comparator):
        pivot = arr[high]
        i = low - 1

        for j in range(low, high):
            if comparator.compare(arr[j], pivot) <= 0:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1

    def _quick_sort_recursive(self, arr, low, high, comparator):
        if low < high:
            pi = self._partition(arr, low, high, comparator)
            
            self._quick_sort_recursive(arr, low, pi - 1, comparator)
            self._quick_sort_recursive(arr, pi + 1, high, comparator)