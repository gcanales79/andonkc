module.exports = function(sequelize, DataTypes) {
    var Falla = sequelize.define("Falla", {
        falla: {
          type: DataTypes.STRING,
          allowNull:false,
          unique:true,
        }
        
    
      });
    
    
      return Falla;
    }