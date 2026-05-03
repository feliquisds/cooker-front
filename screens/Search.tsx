import { Section } from '../components/Alignments';
import { Title } from '../components/Texts';
import { SimpleScreen } from '../components/Interface';
import { SearchBox } from '../components/Inputs';

export default function Search() {
    return (
        <SimpleScreen tabScreen>
            <Section gap={15}>
                <Title>Buscar</Title>

                <SearchBox
                    onChangeText={(value) => console.log('Valor de busca:', value)}
                />
            </Section>
        </SimpleScreen>
    );
}