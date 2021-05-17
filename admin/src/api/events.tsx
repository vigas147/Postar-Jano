import axios from "axios";

export interface IEvent {
    id :number;
    title :string;
}

export const listEvents = (token:string|null) => {
    return new Promise<IEvent[]>((resolve, reject) => {
        axios.get<IEvent[]>(
            'http://localhost:5000/api/events',
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