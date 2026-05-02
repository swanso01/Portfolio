class WordList:
    def __init__(self, words):
        #Stores the list of words
        self.words = words

    def clone(self):
        #Returns a new WordList with a copy of the word list
        return WordList(self.words[:])
