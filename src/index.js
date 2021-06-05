const React = require("react");

const CacheContext = React.createContext({
    // Default value
    data: {},
    refreshCache: () => console.log("No Provider found."),
    refreshCachePiece: () => console.log("No Provider found.")
});

/**
 * Pass an object of endpoints, indexed by endpoint name.
 * This component will make the fetched results of
 * those endpoints available to `children`. They will be
 * stored in an object, indexed by endpoint name.
 * Cache refresh methods are also made available.
 * It will recache as needed if the endpoints prop is
 * updated, meaning, if an endpoint is added or changed,
 * the result for that endpoint will be fetched and added
 * or changed.
 */
class CacheProvider extends React.Component {
    static defaultProps = {
        endpoints: {
            endpoint1: ""
        }
    };

    constructor(props) {
        super(props);
        // Initialize the state results.
        this.state = Object.keys(props.endpoints).reduce((acc, key) => {
            acc[key] = { result: null, error: null };
            return acc;
        }, {});
    }

    componentDidMount = () => this.initializeCache();

    componentDidUpdate({ endpoints: oldEndpoints }) {
        this.updateCache(oldEndpoints);
    }

    // Populates the entire cache. Exposed to children
    // as `refreshCache`.
    initializeCache = () => {
        const { endpoints } = this.props;
        Object.keys(endpoints).forEach(endpointName =>
            this.fetchAndSaveData(endpoints[endpointName], endpointName)
        );
    };

    updateCache = oldEndpoints => {
        const { endpoints } = this.props;
        Object.keys(endpoints).forEach(endpointName => {
            if (endpoints[endpointName] !== oldEndpoints[endpointName]) {
                // This endpoint was changed or added to the cache configuration.
                // Let's fetch for it.
                this.fetchAndSaveData(endpoints[endpointName], endpointName);
            }
            // TODO: Add removal of data for endpoints
            // that were removed from the endpoints prop
        });
    };

    // Exposed to children, so they can refresh a single cache if needed.
    refreshCachePiece = endpointName =>
        this.fetchAndSaveData(this.props.endpoints[endpointName], endpointName);

    fetchAndSaveData = (endpoint, endpointName) =>
        // TODO: Add isLoading property to each object in state
        fetch(endpoint)
            .then(res => (res.ok ? res.json() : Promise.reject(res)))
            .then(result => this.setState({ [endpointName]: { result, error: null } }))
            .catch(error => this.setState({ [endpointName]: { result: null, error } }));

    render = () => (
        <CacheContext.Provider
            value={{
                data: this.state,
                refreshCache: this.initializeCache,
                refreshCachePiece: this.refreshCachePiece
            }}
        >
            {this.props.children}
        </CacheContext.Provider>
    );
}

const CacheConsumer = CacheContext.Consumer;

module.exports = {
    CacheProvider,
    CacheConsumer,
    CacheContext
};
