import {render, screen} from '@/helpers/tests/test-utils'
import UtilisateursListPage from '@/pages/administrations/utilisateurs/UtilisateurListPage';

describe('Login page', () => {
    it.only('Utilisateur peut se connecter', () => {
        render(<UtilisateursListPage/>);

        const inputEmail = screen.getByLabelText('Email');
        expect(inputEmail).toBeInTheDocument();

        const inputPassword = screen.getByLabelText('Mot de passe')
        expect(inputPassword).toBeInTheDocument();

        const connexionButton = screen.getByText('Se connecter');
        expect(connexionButton).toBeInTheDocument();


    })
})
