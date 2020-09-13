import { withRouter } from 'next/router';
import { Layout } from '../components/layout';

interface Props {
    router?: any;
}

const Post: React.FunctionComponent<Props> = ({ router }) => {
    return (
        <Layout showNav={true}>
            <h1>{router.query.title}</h1>
            <p>This is the blog post content.</p>
        </Layout>
    );
};

export default withRouter(Post);
