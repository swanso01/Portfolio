from sorter import Sorter
from wordlist import WordList
from alphabet_comparator import AlphabetComparator

class InsertionSorter(Sorter):
    def __init__(self):
        super().__init__("InsertionSort")

    def sort(self, word_list: WordList, comparator: AlphabetComparator):
        words = word_list.words
        
        for i in range(1, len(words)):
            key = words[i]
            j = i - 1
            
            while j >= 0 and comparator.compare(words[j], key) > 0:
                words[j + 1] = words[j]
                j -= 1
            words[j + 1] = key