class Alphabet:
    def __init__(self, chars):
        # Stores the list of characters
        self.chars = chars
        # Creates a map from character to index
        self.index_map = {char: i for i, char in enumerate(chars)}

    def index_of(self, char):
        # Returns the index of the character in the alphabet
        return self.index_map[char]
