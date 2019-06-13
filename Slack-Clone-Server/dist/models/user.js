"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Create a 'User' table */
var _default = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'Username must only contain letters and numbers'
        },
        len: {
          args: [3, 25],
          msg: 'The username needs to be between 3 and 25 characters long'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: 'The password must be between 5 and 100 characters long'
        }
      }
    }
  }, {
    hooks: {
      afterValidate: async user => {
        const hashedPassword = await _bcrypt.default.hash(user.password, 12); // eslint-disable-next-line no-param-reassign

        user.password = hashedPassword;
      }
    }
  }); // Define associations

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    }); // One to Many

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    }); // One to Many

    User.belongsToMany(models.Channel, {
      through: models.PrivateChannelMember,
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  };

  return User;
};

exports.default = _default;