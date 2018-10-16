module.exports = function(sequelize, DataTypes) {
var Operador = sequelize.define("Operador", {
    nomina: {
      type: DataTypes.INTEGER,
      allowNull:false,
      unique:true,
    },
    nombre:{
      type:DataTypes.TEXT,
      allowNull:false
    }
    

  });


  return Operador;
}