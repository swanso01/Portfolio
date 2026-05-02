import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class ClientHandler extends Thread {
    private final Socket clientSocket;
    private final BufferedReader reader;
    private final PrintWriter writer;

    public ClientHandler(Socket socket) throws IOException {
        this.clientSocket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new PrintWriter(socket.getOutputStream(), true);
    }

    @Override
    public void run() {
        try {
            String inputLine;
            while ((inputLine = reader.readLine()) != null) {
             
                String response = processRequest(inputLine);
                writer.println(response);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                clientSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private String processRequest(String request) {
        String[] parts = request.trim().split(":", 2);
        if (parts.length != 2) {
            return "Invalid request format";
        }
        String command = parts[0].trim().toUpperCase();
        String argument = parts[1].trim();
        switch (command) {
            case "GET_WEATHER":
                return new Weather().getWeather(argument);
            case "GET_VERSE":
                return new Bible().getVerse(argument);
            case "GET_FACTORIAL":
                try {
                    int number = Integer.parseInt(argument);
                    int factorial = new Factorial().calculateFactorial(number);
                    return "Factorial of " + number + " is " + factorial;
                } catch (NumberFormatException e) {
                    return "Invalid number format";
                }
            default:
                return "Unknown command";
        }
    }


}
