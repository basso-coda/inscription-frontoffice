
import { ListBox } from "primereact/listbox";
import { useEffect, useState } from "react";

const AffectationProfileRole = (props) => {
  const [newProfils, setNewProfils] = useState(() => {
    return props.profils.filter(p => p?.ROLES?.some(r => r.ID_ROLE === props.roleID))
  });

  const [profils, setProfils] = useState(() => {
    if (!props.roleID) {
      return props.profils;
    }

    return props.profils.filter(profil => !newProfils.some(p => profil.ID_PROFIL === p.ID_PROFIL))
  });

  const handleSelectedProfil = (event) => {
    if (event.target.id === 'profils') {
      setProfils(profils => profils.filter(p => p.ID_PROFIL !== event.value.ID_PROFIL))
      setNewProfils(profils => [...profils, { ...event.value }])

      return;
    }

    setNewProfils(profils => profils.filter(p => p.ID_PROFIL !== event.value.ID_PROFIL))
    setProfils(profils => [...profils, { ...event.value }])
  }

  useEffect(() => {
    props.setSelectedProfils(newProfils);
  }, [newProfils])

  return (
    <div className="m-0 row">
      <div className="col-md-6">
        <div className=" flex justify-content-center">
          <ListBox
            listStyle={{ maxHeight: "250px" }}
            onChange={handleSelectedProfil}
            id="profils"
            title="profils"
            filter
            // value={selectedProfil}
            options={profils}
            optionLabel="DESCRIPTION"
            className="w-full md:w-33rem"
          />
        </div>
      </div>

      <div className="col-md-6">
        <div className=" flex justify-content-center">
          <ListBox
            listStyle={{ maxHeight: "250px" }}
            id="selctedProfils"
            title="selctedProfils"
            optionLabel="DESCRIPTION"
            // value={currSelectedProfil}
            filter
            onChange={handleSelectedProfil}
            options={newProfils}
            className="w-full md:w-33rem"
          />
        </div>
      </div>
    </div>
  );
};

export default AffectationProfileRole;