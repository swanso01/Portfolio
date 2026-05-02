
public class Dice {
	int count;
	int[] values;
	
	private int[] diceValues(int[] values) {
		int[] dice = new int[6];
		for (int i = 0; i < values.length; i++) {
			dice[values[i] - 1]++;
		}
		return dice;
	}
	
	public Dice(int count) {
		this.count = count;
		this.values = new int[count];
		for (int i = 0; i < count; i++) {
			values[i] = (int) (Math.random() * 6) + 1;
		}
	}

	public Dice(int count, int[] values) {
        this.count = count;
        this.values = values;
    }
	
	public int count(int value) {
		int[] dice = diceValues(values);
		return dice[value - 1];
	}
	
	public int getValue(int index) {
		return values[index];
	}
	
	public void roll(int index) {
		values[index] = (values[index] % 6) + 1;
    }
	
	public int total() {
        int sum = 0;
        for (int i = 0; i < values.length; i++) {
            sum += values[i];
        }
        return sum;
    }
	
	public String toString() {
		String result = "";
		for (int i = 0; i < values.length; i++) {
			result += values[i] + " ";
		}
		return result;
	}
	
	public RiggedDice rigged(int[] rolls) {
		return new RiggedDice(count, rolls);
	}
	
	public static void main(String[] args) {
		Dice dice = new Dice(5);
		System.out.println(dice);
		System.out.println(dice.count(3));
		System.out.println(dice.total());
		dice.roll(0);
		System.out.println(dice);
		System.out.println(dice.count(3));
		System.out.println(dice.total());
		int[] values = { 1, 2, 3, 4, 5 };
		Dice dice2 = new Dice(5, values);
		System.out.println(dice2);
		System.out.println(dice2.count(3));
		System.out.println(dice2.total());
		dice2.roll(0);
		System.out.println(dice2);
		System.out.println(dice2.count(3));
		System.out.println(dice2.total());
	}
	


}





