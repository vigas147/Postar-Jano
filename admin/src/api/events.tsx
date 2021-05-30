import axios from "axios";

export interface IEvent {
    id :number;
    title :string;
    date_from :string;
    date_to :string;
    description :string;
    location :string;
    owner_id :number;
    days :IDay[];
}

export interface IDay {
    id :number;
    description :string;
    price :number;
    capacity: number;
    limit_boys: number|null;
    limit_girls: number|null;
}

export const listEvents = (token:string|null) => {
    return new Promise<IEvent[]>((resolve, reject) => {
        axios.get<IEvent[]>(
            'https://leto.sbb.sk/api/events',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then((resp) => resolve(resp.data)).catch(
            (err) => {
                if (err.response.status === 401) {
                    console.log("Invalid token")
                    resolve([])
                } else {
                    reject(err)
                }
            })
    })
}

export interface IStat {
    day_id: number;
    event_id: number;
    capacity: number;
    limit_boys: number|null;
    limit_girls: number|null;
    boys_count: number;
    girls_count: number;
}

export const getStats = (token:string|null) => {
    return new Promise<IStat[]>((resolve, reject) => {
        axios.get<IStat[]>(
            'https://leto.sbb.sk/api/stats',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then((resp) => resolve(resp.data)).catch(
            (err) => {
                if (err.response.status === 401) {
                    console.log("Invalid token")
                    resolve([])
                } else {
                    reject(err)
                }
            })
    })
}