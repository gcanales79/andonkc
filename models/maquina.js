module.exports = function(sequelize, DataTypes) {
    var Maquina = sequelize.define("Maquina", {
        maquina: {
          type: DataTypes.STRING,
          allowNull:false,
          unique:true,
        }
        
    
      });
    
    
      return Maquina;
    }