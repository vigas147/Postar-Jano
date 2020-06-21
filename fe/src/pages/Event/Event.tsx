import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import React from 'react';
import './Event.scss';
import { RouteComponentProps } from 'react-router-dom';
import Stepper from '../../components/Stepper/Stepper';
import { IEvent, Stat } from '../../types/types';
import { ApiClientContext } from '../../services/apiContext';

interface Props extends RouteComponentProps<{
    id: string;
}> { }

interface State {
    event: IEvent | null,
    stats: Stat[] | null,
    persons: any
}

class EventComponent extends React.Component<Props, State> {
    static contextType = ApiClientContext;
    context!: React.ContextType<typeof ApiClientContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            event: null,
            persons: null,
            stats: null
        };
    }

    componentDidMount() {
        if (!this.context) {
            return;
        }

        this.context.event.get(parseInt(this.props.match.params.id, 10))
        .then(event => {
            this.setState({
                ...this.state,
                event,
            })
        })
        .catch(err => {
            throw err            
        })

        this.context.event.stats(parseInt(this.props.match.params.id, 10))
        .then(stats => {
            this.setState({
                ...this.state,
                stats,
            })
        })
        .catch(err => {
            throw err            
        })
    }

    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{this.state.event?.title}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">{this.state.event?.title}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    {
                        this.state.event && this.state.stats && <Stepper event={this.state.event} stats={this.state.stats} />
                    }
                    {
                        this.state.event == null &&
                        <IonLoading
                            isOpen={true}
                            message={'Načítavam akciu...'}
                        />
                    }
                </IonContent>
            </IonPage>
        )
    }
};

export default EventComponent;
