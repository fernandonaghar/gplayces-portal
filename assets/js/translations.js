app.config(config);

config.$inject = ['$translateProvider'];

function config($translateProvider) {

    //-------- Translations section ---------
    var en_translations = {

        // Outer translations
        'NEW_TO_GPLAYCES': 'New to Gplayces?',
        'REGISTER': 'Register!',
        'LOGIN_PREFER': 'Or if you prefer',
        'FORGOT_PASSWORD': 'Forgot your password?',
        'FIELD_REQUIRED': 'Required field.',
        'LOGIN_FACEBOOK': 'Login with Facebook',
        'INVALID_EMAIL_OR_PWD': 'Invalid e-mail and/or password.',
        'FACEBOOK_LOGIN_FAILED': 'Facebook login has failed. If you wish, you can register a new account using your e-mail address and associate facebook at a later time.',
        'REGISTRATION_SUCCESSFUL': 'Registration successful. You may already login.',
        'PASSWORD_RESET_MESSAGE': 'An e-mail has been sent to your e-mail address. Please follow the e-mailed instructions to perform the password reset.',
        'ALREADY_HAVE_ACCOUNT': 'Already have an account?',
        'RETURN_TO_LOGIN': 'Return to Login',
        'NEW_ACCOUNT': 'New Account',
        'FIRST_NAME': 'First Name',
        'LAST_NAME': 'Last Name',
        'PASSWORD': 'Password',

        //Sidebar
        'WELCOME': 'Welcome',
        'DASHBOARD': 'Dashboard',

        'PLACES': 'Places',
        'MY_PLACES': 'My Places',
        'CREATED_PLACES': 'Registered Places',
        'PLACES_FORM': 'Place Registration',
        'ADMIN': 'Administrator',
        'ADMIN_REQUESTS': 'Administration Requests',
        'CITIES_FORM': 'Cities Registration',
        'PROFILE': 'User Profile',
        'LOGOUT': 'Logout',

        'MONDAY': 'Monday',
        'TUESDAY': 'Tuesday',
        'WEDNESDAY': 'Wednesday',
        'THURSDAY': 'Thursday',
        'FRIDAY': 'Friday',
        'SATURDAY': 'Saturday',
        'SUNDAY': 'Sunday',
        'HOLYDAY': 'Holyday',

        'COVER_IMAGE_REQUIRED': 'It is necessary to add a cover image to your place before activating it.'
    }

    var pt_translations = {
        // Outer Translations 
        'NEW_TO_GPLAYCES': 'Novo ao Gplayces?',
        'REGISTER': 'Registre-se!',
        'LOGIN_PREFER': 'Ou se preferir',
        'FORGOT_PASSWORD': 'Esqueceu sua senha?',
        'FIELD_REQUIRED': 'Campo obrigatório.',
        'LOGIN_FACEBOOK': 'Entrar com o Facebook',
        'INVALID_EMAIL_OR_PWD': 'E-mail e/ou senha inválidos.',
        'FACEBOOK_LOGIN_FAILED': 'Login pelo facebook falhou, se desejar, você pode realizar a criação de uma conta a partir de seu e-mail e posteriormente associar sua conta do facebook.',
        'REGISTRATION_SUCCESSFUL': 'Registro realizado com sucesso, você já pode realizar login.',
        'PASSWORD_RESET_MESSAGE': 'Um e-mail foi enviado para sua caixa, por favor siga as instruções para realizar o reset da senha.',
        'ALREADY_HAVE_ACCOUNT': 'Já possui uma conta?',
        'RETURN_TO_LOGIN': 'Voltar para o Login',
        'NEW_ACCOUNT': 'Criar uma conta',
        'FIRST_NAME': 'Primeiro Nome',
        'LAST_NAME': 'Sobrenome',
        'PASSWORD': 'Senha',

        //Sidebar
        'WELCOME': 'Bem vindo',
        'DASHBOARD': 'Painel',

        'PLACES': 'Locais',
        'MY_PLACES': 'Meus Locais',
        'CREATED_PLACES': 'Locais Cadastrados',
        'PLACES_FORM': 'Cadastro de Local',
        'ADMIN': 'Administrador',
        'ADMIN_REQUESTS': 'Solicitações de Administração',
        'CITIES_FORM': 'Cadastro de Cidades',
        'PROFILE': 'Perfil',
        'LOGOUT': 'Logout',

        'MONDAY': 'Segunda',
        'TUESDAY': 'Terça',
        'WEDNESDAY': 'Quarta',
        'THURSDAY': 'Quinta',
        'FRIDAY': 'Sexta',
        'SATURDAY': 'Sábado',
        'SUNDAY': 'Domingo',
        'HOLYDAY': 'Feriado',

        'COVER_IMAGE_REQUIRED': 'É necessário adicionar uma imagem de capa a seu local antes de ativa-lo.'
    }

    $translateProvider.translations('enu', en_translations);
    $translateProvider.translations('ptb', pt_translations);

    $translateProvider.preferredLanguage('ptb');
}