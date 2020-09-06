import React from 'react';
import { Layout } from '../components/layout';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import styles from './about.module.scss';

interface PostLinkProps {
    title?: string;
};

const PostLink: React.FunctionComponent<PostLinkProps> = ({ title }) => {
    return (
        <li>
            <Link href={`/post?title=${title}`}>
                <a>{title}</a>
            </Link>
        </li>
    );
};

interface State {
    text: string;
}

export default class About extends React.Component<{}, State> {
    public state: State = {
        text: ''
    };

    private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        this.setState({ text: event.target.value });
    };

    public render() {
        return (
            <Layout title="About" showNav={true}>
                <h1 className={styles.test}>This is About page ✌</h1>
                <div className={styles.pai}>
                    <div className={styles['filho-dois']}></div>
                </div>
                <PostLink title="Hello Next.js" />
                <PostLink title="Learn Next.js is awesome" />
                <PostLink title="Deploy apps with Zeit" />
                <Button variant="secondary" onClick={() => console.log(this.state)}>Primary</Button>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" onChange={this.handleChange} />
                    </Form.Group>
                </Form>
            </Layout>
        );
    }
};
