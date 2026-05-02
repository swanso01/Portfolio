import csv
import time
import random

class SongRecord:
    def __init__(self, artist, album, title, genre, duration, times_played, rating):
        self.artist = artist
        self.album = album
        self.title = title
        self.genre = genre
        self.duration = duration
        self.times_played = int(times_played)
        self.rating = int(rating)

    def __str__(self):
        return (f'"{self.title}" by {self.artist} | Album: {self.album} '
                f'({self.genre}) | {self.duration} | Played: {self.times_played} '
                f'| Rating: {self.rating}/5')

class Node:
    def __init__(self, song_record):
        self.data = song_record
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, song_record):
        new_node = Node(song_record)
        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node

    def insert_front(self, song_record):
        new_node = Node(song_record)
        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
        print("Song added.")

    def find_song(self, title):
        current = self.head
        while current:
            if current.data.title.lower() == title.lower():
                return current
            current = current.next
        return None

    def delete_song(self, title):
        node_to_delete = self.find_song(title)
        if node_to_delete is None:
            print("Song not found.")
            return False

        if node_to_delete.prev:
            node_to_delete.prev.next = node_to_delete.next
        else:
            self.head = node_to_delete.next

        if node_to_delete.next:
            node_to_delete.next.prev = node_to_delete.prev
        else:
            self.tail = node_to_delete.prev
        print("Song deleted.")
        return True

    def edit_song(self, title):
        node_to_edit = self.find_song(title)
        if node_to_edit is None:
            print("Song not found.")
            return

        song = node_to_edit.data
        print(f"Editing '{song.title}':")
        new_artist = input(f"Artist [{song.artist}]: ") or song.artist
        new_album = input(f"Album [{song.album}]: ") or song.album
        new_genre = input(f"Genre [{song.genre}]: ") or song.genre
        song.artist = new_artist
        song.album = new_album
        song.genre = new_genre
        print("Song updated.")

    def rate_song(self, title):
        node_to_rate = self.find_song(title)
        if node_to_rate is None:
            print("Song not found.")
            return

        while True:
            try:
                new_rating = int(input(f"New rating for '{title}' (1-5): "))
                if 1 <= new_rating <= 5:
                    node_to_rate.data.rating = new_rating
                    print("Rating updated.")
                    break
                else:
                    print("Invalid rating (1-5).")
            except ValueError:
                print("Invalid number.")

    def play_songs(self):
        if not self.head:
            print("Playlist empty.")
            return

        current = self.head
        while current:
            print(f"Playing: {current.data.title}")
            current.data.times_played += 1
            time.sleep(1)
            current = current.next
        print("Playlist finished.")

    def shuffle(self):
        if not self.head:
            print("Playlist empty.")
            return

        songs = []
        current = self.head
        while current:
            songs.append(current)
            current = current.next

        random.shuffle(songs)

        print("Shuffled Playlist:")
        for node in songs:
            print(f"Playing: {node.data.title}")
            node.data.times_played += 1
            time.sleep(1)
        print("Shuffle finished.")

    def display(self):
        if not self.head:
            print("Playlist empty.")
            return

        print("\n Current Playlist")
        current = self.head
        count = 1
        while current:
            print(f"{count}. {current.data}")
            current = current.next
            count += 1

    def load_from_csv(self, filename="musicPlaylist.csv"):
        try:
            with open(filename, 'r', newline='', encoding='utf-8') as file:
                reader = csv.reader(file)
                self.head = self.tail = None
                for row in reader:
                    try:
                        if len(row) == 7:
                            song = SongRecord(row[0], row[1], row[2], row[3], row[4], row[5], row[6])
                            self.append(song)
                        else:
                            print(f"Skipping invalid row: {row}")
                    except ValueError as e:
                        print(f"Error processing row {row}: {e}")
                print("Playlist loaded.")
        except FileNotFoundError:
            print("File not found.")
        except Exception as e:
            print(f"Error: {e}")

    def store_to_csv(self, filename="musicPlaylist.csv"):
        if not self.head:
            print("Playlist empty.")
            return

        try:
            with open(filename, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                current = self.head
                while current:
                    song = current.data
                    writer.writerow([
                        song.artist, song.album, song.title, song.genre,
                        song.duration, song.times_played, song.rating
                    ])
                    current = current.next
            print("Playlist stored.")
        except Exception as e:
            print(f"Error: {e}")

    def sort_playlist(self):
        if not self.head or not self.head.next:
            print("Playlist is empty or has only one song.")
            return

        print("Sort by:")
        print("1. Artist (A-Z)")
        print("2. Album title (A-Z)")
        print("3. Rating (1-5)")
        print("4. Times played (largest-smallest)")
        choice = input("Enter choice: ")

        songs = []
        current = self.head
        while current:
            songs.append(current.data)
            current = current.next

        if choice == '1':
            songs.sort(key=lambda song: song.artist.lower())
            print("Playlist sorted by artist.")
        elif choice == '2':
            songs.sort(key=lambda song: song.album.lower())
            print("Playlist sorted by album title.")
        elif choice == '3':
            songs.sort(key=lambda song: song.rating, reverse=True)
            print("Playlist sorted by rating.")
        elif choice == '4':
            songs.sort(key=lambda song: song.times_played, reverse=True)
            print("Playlist sorted by times played.")
        else:
            print("Invalid choice.")
            return

        self.head = self.tail = None
        for song in songs:
            self.append(song)

def print_menu():
    print("1. Load playlist")
    print("2. Store playlist")
    print("3. Display playlist")
    print("4. Insert song")
    print("5. Delete song")
    print("6. Edit song")
    print("7. Rate song")
    print("8. Play playlist")
    print("9. Sort playlist")
    print("10. Shuffle playlist")
    print("11. Exit")

def main():
    playlist = DoublyLinkedList()
    while True:
        print_menu()
        choice = input("Enter choice: ")

        if choice == '1':
            playlist.load_from_csv()
        elif choice == '2':
            playlist.store_to_csv()
        elif choice == '3':
            playlist.display()
        elif choice == '4':
            artist = input("Artist: ")
            album = input("Album: ")
            title = input("Title: ")
            genre = input("Genre: ")
            duration = input("Duration (MM:SS): ")
            new_song = SongRecord(artist, album, title, genre, duration, 0, 0)
            playlist.insert_front(new_song)
        elif choice == '5':
            title = input("Title to delete: ")
            playlist.delete_song(title)
        elif choice == '6':
            title = input("Title to edit: ")
            playlist.edit_song(title)
        elif choice == '7':
            title = input("Title to rate: ")
            playlist.rate_song(title)
        elif choice == '8':
            playlist.play_songs()
        elif choice == '9':
            playlist.sort_playlist()
        elif choice == '10':
            playlist.shuffle()
        elif choice == '11':
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()