
public class RiggedDice extends Dice {
	    
        private int[] rolls;
        private int index;
        
        public RiggedDice(int count, int[] rolls) {
            super(count);
            this.rolls = rolls;
            this.index = 0;
        }

    
        public int roll() {
            int roll = rolls[index];
            index = (index + 1) % rolls.length;
            return roll;
        }

		
		// TODO Auto-generated constructor stub
	}


