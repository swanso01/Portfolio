class AlphabetComparator:
    def __init__(self, alphabet):
        # Saves the Alphabet object
        self.alphabet = alphabet

    def compare(self, word1, word2):
        # Compares two words using the custom alphabet
        for c1, c2 in zip(word1, word2):
            if c1 != c2:
                return self.alphabet.index_of(c1) - self.alphabet.index_of(c2)
        return len(word1) - len(word2)
