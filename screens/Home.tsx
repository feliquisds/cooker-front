import { Title } from '../components/Texts';
import { SimpleScreen } from '../components/Interface';
import type { ScreenNavigation } from '../components/Types';

type HomeNavigation = ScreenNavigation<{
    QRCode: undefined;
    ViewStatement: undefined;
    AddCredit: undefined;
}>;

export default function Home({ navigation }: { navigation: HomeNavigation }) {
    return (
        <SimpleScreen tabScreen>
            <Title>Início</Title>
        </SimpleScreen>
    );
}