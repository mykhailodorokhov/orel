'use strict';
module.exports = (sequelize, DataTypes) => {
  const Relation = sequelize.define('Relation', {} , {});
  Relation.associate = function(models) {
    Relation.belongsTo(models.Organization, {as: 'parent'});
    Relation.belongsTo(models.Organization, {as: 'daughter'});
  };
  return Relation;
};