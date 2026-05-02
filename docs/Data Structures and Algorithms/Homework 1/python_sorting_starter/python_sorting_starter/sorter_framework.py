import time
import sys
from alphabet import Alphabet
from alphabet_comparator import AlphabetComparator
from wordlist import WordList
from insertion_sorter import InsertionSorter
from merge_sorter import MergeSorter
from quick_sorter import QuickSorter

def read_file(filename):
    try:
        with open(filename, 'r') as f:
            return [line.strip() for line in f]
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
        sys.exit(1)

def main():
    if len(sys.argv) != 3:
        print("Usage: python sorter_framework.py alphabet.txt wordlist.txt")
        return

    alphabet_chars = read_file(sys.argv[1])
    word_strings = read_file(sys.argv[2])
    
    custom_alphabet = Alphabet(alphabet_chars)
    comparator = AlphabetComparator(custom_alphabet)
    original_word_list = WordList(word_strings)
    
    sorters = [
        InsertionSorter(),
        MergeSorter(),
        QuickSorter()
    ]

    for sorter in sorters:
        word_list_copy = original_word_list.clone()
        
        if isinstance(sorter, InsertionSorter) and len(word_list_copy.words) > 10000:
            print(f"--- {sorter.name} ---")
            print("Skipped for large input size to save time.")
            print("-" * (len(sorter.name) + 8) + "\n")
            continue
        
        start_time = time.perf_counter()
        sorter.sort(word_list_copy, comparator)
        end_time = time.perf_counter()
        
        duration_ms = (end_time - start_time) * 1000
        
        print(f"--- {sorter.name} ---")
        print(f"Alphabet count: {len(custom_alphabet.chars)}")
        print(f"Word count: {len(word_list_copy.words)}")
        print(f"Time: {duration_ms:.4f} ms")
        print(f"First 10 words: {word_list_copy.words[:10]}")
        print("-" * (len(sorter.name) + 8) + "\n")


if __name__ == "__main__":
    main()