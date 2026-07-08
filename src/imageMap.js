// Set images
import pearl from "./assets/pearl.jpg";
import WWT from "./assets/WWT.jpg";
import castle from "./assets/castle.png";
import police from "./assets/police.jpg";
import bugle from "./assets/bugle.png";
import ATOT from "./assets/ATOT.jpg";
import batmanSet from "./assets/batman.jpg";
import imperial from "./assets/imperial.jpg";
import tantive from "./assets/tantive.jpg";
import baradur from "./assets/baradur.jpg";
import naboo from "./assets/naboo.jpg";
import flagship from "./assets/flagship.jpg";
import rivendell from "./assets/rivendell.png";
import tower from "./assets/tower.png";
import venator from "./assets/venator.png";
import arkham from "./assets/arkham.jpg";
import gdragon from "./assets/gdragon.jpg";
import tfchase from "./assets/tfchase.jpg";
import palaceC from "./assets/palaceC.jpg";
import isla from "./assets/isla.jpg";
import forestden from "./assets/forestden.jpg";
import racersF from "./assets/racersF.jpg";
import ninL from "./assets/ninL.jpg";
import racersL from "./assets/racersL.jpg";

// Minifigure images
import jackSparrow from "./assets/minifigs/jack-sparrow.jpg";
import cowboy from "./assets/minifigs/cowboy.jpg";
import castleKnight from "./assets/minifigs/castle-knight.jpg";
import policeOfficer from "./assets/minifigs/police-officer.jpg";
import batmanFig from "./assets/minifigs/batman.jpg";
import cloneTrooper from "./assets/minifigs/clone-trooper.jpg";
import spiderman from "./assets/minifigs/spiderman.jpg";
import stormtrooper from "./assets/minifigs/stormtrooper.jpg";
import imperialGuard from "./assets/minifigs/imperial-guard.jpg";
import robin from "./assets/minifigs/robin.jpg";
import cloneCaptain from "./assets/minifigs/clone-captain.jpg";
import reporter from "./assets/minifigs/reporter.jpg";
import mechanic from "./assets/minifigs/mechanic.jpg";
import spacePilot from "./assets/minifigs/space-pilot.jpg";
import archer from "./assets/minifigs/archer.jpg";
import docksidePirate from "./assets/minifigs/dockside-pirate.jpg";

// Namespaced by product type since "set" and "minifig" rows can share the
// same image_key (e.g. both have a "batman" entry pointing at different art).
export const imageMap = {
  set: {
    pearl,
    WWT,
    castle,
    police,
    bugle,
    ATOT,
    batman: batmanSet,
    imperial,
    tantive,
    baradur,
    naboo,
    flagship,
    rivendell,
    tower,
    venator,
    arkham,
    gdragon,
    tfchase,
    palaceC,
    isla,
    forestden,
    racersF,
    ninL,
    racersL,
  },
  minifig: {
    jackSparrow,
    cowboy,
    castleKnight,
    policeOfficer,
    batman: batmanFig,
    cloneTrooper,
    spiderman,
    stormtrooper,
    imperialGuard,
    robin,
    cloneCaptain,
    reporter,
    mechanic,
    spacePilot,
    archer,
    docksidePirate,
  },
};
