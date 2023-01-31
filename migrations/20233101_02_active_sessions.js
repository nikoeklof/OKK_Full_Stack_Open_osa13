const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("active_sessions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expiration: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.addColumn("users", "is_disabled", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("users", "is_disabled");
    await queryInterface.dropTable("active_sessions");
  },
};
