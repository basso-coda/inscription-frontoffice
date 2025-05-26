
import React, { useState } from "react";

import "./StyleFacture.css"
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Logo from "../../assets/logo_bitwi.jpeg";


export default function FactureTheme({ Facturedata,setVisible,visible }) {



    return (
        <>
            <Dialog header="FACTURE" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>

            <Button onClick={()=>{window.print()}}>Imprimer</Button>
                <div className="card p-fluid  print-pages">
                    <div className="container">
                        <div className="invoice">
                            <div className="row">
                                <div className="col-7">
                                    <img src={Logo} className="logo" />
                                </div>
                                <div className="col-5">
                                    <h3 className="document-type display-4">FACTURE</h3>
                                    <p className="text-right"><strong >Référence facture {Facturedata?.NUMERO_FACTURE}</strong></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-7">
                                    <p className="addressMySam">
                                        <strong>BITWI CNCM</strong><br />
                                        Burundi<br />
                                       Bujumbura
                                    </p>
                                </div>
                                <div className="col-5">
                                    <br /><br /><br />
                                    <p className="addressDriver">
                                        <strong th:text="${driver.getCompanyName()}">Société VTC</strong><br />
                                        Réf. Client <em th:text="${driver.getUserId()}">Référence client</em><br />
                                        <span >{Facturedata?.partenaire?.PRENOM_PARTENAIRE}</span> <span
                                            >{Facturedata?.partenaire?.NOM_PARTENAIRE}</span><br />
                                        <span >{Facturedata?.partenaire?.ADRESSE_COMPLET}</span><br />
                                        {/* <span th:text="${driver.getZipCode()}">code postal</span>  */}
                                        <span>Bujumbura</span>
                                    </p>
                                </div>
                            </div>
                            <br />
                            <br />

                            <br />
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                    <th>Code</th>
                                        <th>Lapin</th>

                                        <th>Poid</th>
                                        <th>Provenance</th>
                                        <th className="text-right">Couleur</th>
                                        <th className="text-right">Genre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>{Facturedata?.lapins?.CODE_LAPIN}</td>
                                        <td>{Facturedata?.lapins?.NOM_LAPIN}</td>
                                         <td>{Facturedata?.lapins?.POIDS}Kg</td>
                                        <td>{Facturedata?.lapins?.IS_FROM_BURUNDI=="2"?"ETRANGER":"BURUNDI"}</td>
                                        <td className="text-right" >{Facturedata?.lapins?.COULEUR}</td>
                                        <td className="text-right" >{Facturedata?.lapins?.SEXE_ID=="1"?"Femelle":"Male"}</td>
                                    </tr>

                                    <tr>
                                        <td><b>Race</b></td>
                                        <td className="text-right" colSpan={5}>{Facturedata?.lapins?.RACE}</td>

                                    </tr>
                                </tbody>
                            </table>
                            <div className="row">
                                <div className="col-8">
                                </div>
                                <div className="col-4">
                                    <table className="table table-sm ">
                                        <tr>
                                            <td><strong>Total</strong></td>
                                            <td className="text-right" >{Facturedata?.MONTANT_TOTAL}</td>
                                        </tr>
                                        <br/><br/>

 {/* <h6>Frais de services du <span ></span>  */}
                            {/* </h6> */}
                                         <tr>

                                            <td className="" >Bujumbura le<br/> <b>{Facturedata?.DATE_FACTURE}</b></td>
                                        </tr>
                                        {/*
                                        <tr>
                                            <td><strong>Total TTC</strong></td>
                                            <td className="text-right" th:text="${totalTTC}">0,00€</td>
                                        </tr> */}
                                    </table>
                                </div>
                            </div>

                            {/* <p className="conditions">
                                En votre aimable règlement
                                <br />
                                Et avec nos remerciements.
                                <br /><br />
                                Conditions de paiement : paiement à réception de facture.
                                <br />
                                Aucun escompte consenti pour règlement anticipé.
                                <br />
                                Règlement par virement bancaire ou carte bancaire.
                                <br /><br />
                                En cas de retard de paiement, indemnité forfaitaire pour frais de recouvrement : 40 euros (art. L.4413
                                et
                                L.4416 code du commerce).
                            </p> */}

                            <br />
                            <br />
                            <br />
                            <br />

                            {/* <p className="bottom-page text-right">
                                MYSAM SAS - N° SIRET 81754802700017 RCS ALBI<br />
                                8, avenue de la Martelle - 81150 TERSSAC 06 32 97 00 22 - www.mysam.fr<br />
                                Code APE 6312Z - N° TVA Intracom. FR 63 817548027<br />

                            </p> */}
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
