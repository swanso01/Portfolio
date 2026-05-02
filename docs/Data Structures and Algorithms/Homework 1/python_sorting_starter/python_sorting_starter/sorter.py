class Sorter:
    def __init__(self, name):
        # Stores the name of the sorting algorithm
        self.name = name

    def sort(self, word_list, comparator):
        # This method should be implemented by subclasses
        raise NotImplementedError("Subclasses must implement this")
