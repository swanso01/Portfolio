import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class Weather {
    private String apiKey = "bdec60aa6948cceed19c1f616336a8b3";
    private String apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

    public String getWeather(String city) {
        try {
            URL url = new URL(apiUrl + city + "&appid=" + apiKey);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("Failed " + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                response.append(output);
            }

            conn.disconnect();
            String jsonResponse = response.toString();
            jsonResponse = jsonResponse.replace("}"," , \"temperature_Fahrenheit\":\"" + kelvinToFahrenheit(getTemperature(jsonResponse)) + "\"}");
            return jsonResponse;
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private double getTemperature(String jsonResponse) {
        int tempStartIndex = jsonResponse.indexOf("\"temp\":") + 7;
        int tempEndIndex = jsonResponse.indexOf(",", tempStartIndex);
        String tempStr = jsonResponse.substring(tempStartIndex, tempEndIndex);
        return Double.parseDouble(tempStr);
    }

    private double kelvinToFahrenheit(double kelvin) {
        return (kelvin - 273.15) * 9/5 + 32;
    }
}
