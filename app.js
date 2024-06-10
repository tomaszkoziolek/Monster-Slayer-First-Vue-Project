function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      specialAttackAvailable: true,
      winner: null,
      battleLog: [],
    };
  },
  mounted() {
    document.addEventListener(
      "dblclick",
      function (event) {
        event.preventDefault();
      },
      { passive: false }
    );
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },

    playerBarStyles() {
      if (this.playerHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //player lost
        this.winner = "monster";
      }
    },

    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //monster lost
        this.winner = "player";
      }
    },
  },
  methods: {
    surrender() {
      this.winner = "monster";
    },

    newGame() {
      this.winner = null;
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.specialAttackAvailable = true;
      this.battleLog = [];
    },

    playerAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      // console.log(attackValue)
      this.monsterHealth -= attackValue;
      this.specialAttackAvailable = true;
      this.addLogMessage("Player", "Attack", attackValue);
      this.monsterAttack();
    },

    monsterAttack() {
      const attackValue = getRandomValue(8, 16);
      //   console.log(attackValue)
      this.playerHealth -= attackValue;
      this.addLogMessage("Monster", "Attack", attackValue);
    },

    playerSpecialAttack() {
      this.currentRound++;
      const randNum = Math.random();
      // console.log(randNum);
      if (randNum < 0.35) {
        // console.log("Missed!");
        this.addLogMessage("Player", "Special Attack", "Missed!");
      } else {
        const specialAttackValue = getRandomValue(12, 25);
        this.monsterHealth -= specialAttackValue;
        this.addLogMessage("Player", "Special Attack", specialAttackValue);
        // console.log(specialAttackValue)
      }

      this.specialAttackAvailable = false;
      this.monsterAttack();
    },

    playerHeal() {
      const healValue = getRandomValue(8, 18);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
        this.addLogMessage("Player", "Heal", "Healed to full HP!");
      } else {
        this.playerHealth += healValue;
        this.addLogMessage("Player", "Heal", healValue);
      }

      this.monsterAttack();
    },

    addLogMessage(who, what, value) {
      this.battleLog.unshift({
        byWho: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
