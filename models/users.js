const { DataTypes, Model } = require('sequelize');

module.exports = class config extends Model {
  static init(sequelize){
    return super.init({
    discordid: {
      type: DataTypes.STRING(20),
      allowNull: false,
			primaryKey: true
    },
    charname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "No iniciado"
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    medal_gold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    medal_silver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    medal_bronze: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    medal_iron: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    medal_cardboard: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true
  });
}
}