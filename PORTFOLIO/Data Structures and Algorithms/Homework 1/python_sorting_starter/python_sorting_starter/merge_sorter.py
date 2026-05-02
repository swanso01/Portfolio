from sorter import Sorter
from wordlist import WordList
from alphabet_comparator import AlphabetComparator

class MergeSorter(Sorter):
    def __init__(self):
        super().__init__("MergeSort")

    def sort(self, word_list: WordList, comparator: AlphabetComparator):
        words = word_list.words
        self._merge_sort_recursive(words, comparator)

    def _merge_sort_recursive(self, arr, comparator):
        if len(arr) > 1:
            mid = len(arr) // 2
            left_half = arr[:mid]
            right_half = arr[mid:]

            self._merge_sort_recursive(left_half, comparator)
            self._merge_sort_recursive(right_half, comparator)

            i = j = k = 0
            while i < len(left_half) and j < len(right_half):
                if comparator.compare(left_half[i], right_half[j]) < 0:
                    arr[k] = left_half[i]
                    i += 1
                else:
                    arr[k] = right_half[j]
                    j += 1
                k += 1

            while i < len(left_half):
                arr[k] = left_half[i]
                i += 1
                k += 1

            while j < len(right_half):
                arr[k] = right_half[j]
                j += 1
                k += 1