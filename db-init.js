docker run -d --name mongo-final --network assignment2 -p "27017:27017" -e "MONGO_INITDB_ROOT_USERNAME=root" -e "MONGO_INITDB_ROOT_PASSWORD=hunter2" mongo
winpty docker run --rm -it --network assignment2 mongo mongo --host mongo-final --username root --password hunter2 --authenticationDatabase admin

MONGO_DATABASE=heroes
MONGO_ROOT_USER=root
MONGO_ROOT_PASSWORD=hunter2
MONGO_USER=heroes
MONGO_PASSWORD=hunter2


db.heroes.insertMany([
  {
    "name": "D.VA",
    "role": "TANK",
    "description": "D.Va’s mech is nimble and powerful."
  },
  {
    "name": "ORISA",
    "role": "TANK",
    "description": "Orisa serves as the central anchor of her team, and defends her teammates from the frontline with a protective barrier."
  },
  {
    "name": "REINHARDT",
    "role": "TANK",
    "description": "Clad in powered armor and swinging his hammer, Reinhardt leads a rocket-propelled charge across the battleground and defends his squadmates with a massive energy barrier."
  },
  {
    "name": "ASHE",
    "role": "DAMAGE",
    "description": "Ashe quickly fires her rifle from the hip or uses her weapon’s aim-down sights to line up a high damage shot."
  },
  {
    "name": "BASTION",
    "role": "DAMAGE",
    "description": "Repair protocols and the ability to transform between stationary Assault, mobile Recon and devastating Tank configurations provide Bastion with a high probability of victory."
  },
  {
    "name": "DOOMFIST",
    "role": "DAMAGE",
    "description": "Doomfist’s cybernetics make him a highly-mobile, powerful frontline fighter."
  },
  {
    "name": "ANA",
    "role": "SUPPORT",
    "description": "Ana’s versatile arsenal allows her to affect heroes all over the battlefield."
  },
  {
    "name": "BAPTISTE",
    "role": "SUPPORT",
    "description": "Baptiste wields an assortment of experimental devices and weaponry to keep allies alive and eliminate threats under fierce conditions."
  },
  {
    "name": "BRIGITTE",
    "role": "SUPPORT",
    "description": "Brigitte specializes in armor. She can throw Repair Packs to heal teammates, or automatically heal nearby allies when she damages foes with her Flail."
  }
])

db.heroSkills.insertMany([
  {
    "heroid": "60c0854aa5482ceaf026c9fd",
    "skill1": "FUSION CANNONS",
    "skill2": "LIGHT GUN",
    "skill3": "BOOSTERS",
    "skill4": "DEFENSE MATRIX",
    "skill5": "MICRO MISSILES",
    "skill6": "SELF-DESTRUCT",
    "skill7": "CALL MECH"
  },
  {
    "heroid": "60c0854aa5482ceaf026c9fe",
    "skill1": "FUSION DRIVER",
    "skill2": "FORTIFY",
    "skill3": "HALT!",
    "skill4": "PROTECTIVE BARRIER",
    "skill5": "SUPERCHARGER"
  },
  {
    "heroid": "60c0854aa5482ceaf026c9ff",
    "skill1": "ROCKET HAMMER",
    "skill2": "BARRIER FIELD",
    "skill3": "CHARGE",
    "skill4": "FIRE STRIKE",
    "skill5": "EARTHSHATTER"
  },
  {
    "heroid": "60c0854aa5482ceaf026ca00",
    "skill1": "THE VIPER",
    "skill2": "DYNAMITE",
    "skill3": "COACH GUN",
    "skill4": "BOB"
  },
  {
    "heroid": "60c0854aa5482ceaf026ca01",
    "skill1": "CONFIGURATION RECON",
    "skill2": "CONFIGURATION SENTRY",
    "skill3": "RECONFIGURE",
    "skill4": "SELF-REPAIR",
    "skill5": "CONFIGURATION TANK"
  },
  {
    "heroid": "60c0854aa5482ceaf026ca02",
    "skill1": "HAND CANNON",
    "skill2": "SEISMIC SLAM",
    "skill3": "RISING UPPERCUT",
    "skill4": "ROCKET PUNCH",
    "skill5": "METEOR STRIKE"
  },
  {
    "heroid": "60c0854aa5482ceaf026ca03",
    "skill1": "BIOTIC RIFLE",
    "skill2": "SLEEP DART",
    "skill3": "BIOTIC GRENADE",
    "skill4": "NANO BOOST"
  },
  {
    "heroid": "60c0854aa5482ceaf026ca04",
    "skill1": "BIOTIC LAUNCHER",
    "skill2": "REGENERATIVE BURST",
    "skill3": "IMMORTALITY FIELD",
    "skill4": "AMPLIFICATION MATRIX",
    "skill5": "EXO BOOTS"
  },
  {
    "heroid": "60c0854aa5482ceaf026ca05",
    "skill1": "ROCKET FLAIL",
    "skill2": "REPAIR PACK",
    "skill3": "WHIP SHOT",
    "skill4": "BARRIER SHIELD",
    "skill5": "SHIELD BASH",
    "skill6": "RALLY"
  }
])

db.heroReviews.insertMany([
  {
    "userid": "60c08606a5482ceaf026ca0f",
    "heroid": "60c0854aa5482ceaf026c9fd",
    "stars": 4.5,
    "commit": "Moving fast"
  },
  {
    "userid": "60c08606a5482ceaf026ca10",
    "heroid": "60c0854aa5482ceaf026c9fe",
    "stars": 3.5,
    "commit": "Moving slow"
  },
  {
    "userid": "60c08606a5482ceaf026ca0f",
    "heroid": "60c0854aa5482ceaf026c9ff",
    "stars": 4.5,
    "commit": "Pretty coolt"
  },
  {
    "userid": "60c08606a5482ceaf026ca11",
    "heroid": "60c0854aa5482ceaf026ca02",
    "stars": 0.5,
    "commit": "I hate him"
  },
  {
    "userid": "60c08606a5482ceaf026ca0f",
    "heroid": "60c0854aa5482ceaf026ca04",
    "stars": 2.0,
    "commit": "Strong fire!"
  }
])

db.users.insertMany([
  {
    "name": "Mike",
    "password": "abcd"
  },
  {
    "name": "Jack",
    "password": "zxcv"
  },
  {
    "name": "Tom",
    "password": "qwer"
  }
])

db.images.insertMany([
  {
    "caption": "Interesting",
    "userid": "60c08606a5482ceaf026ca11",
    "heroid": "60c0854aa5482ceaf026ca02"
  },
  {
    "caption": "Cool",
    "userid": "60c08606a5482ceaf026ca0f",
    "heroid": "60c0854aa5482ceaf026c9fd"
  },
  {
    "caption": "Amazing",
    "userid": "60c08606a5482ceaf026ca0f",
    "heroid": "60c0854aa5482ceaf026c9ff"
  },
  {
    "caption": "Hope you like it",
    "userid": "60c08606a5482ceaf026ca11",
    "heroid": "60c0854aa5482ceaf026ca02"
  }
])
