'use strict';

const { Contract } = require('fabric-contract-api');

class fabcar extends Contract {

    async initLedger(ctx) {
        const assets = [
            {
                ID: 'asset1',
                Color: 'blue',
                Energy: 10,
                Model: 'Tesla X',
                Rate: 300,
            },
            {
                ID: 'asset2',
                Color: 'blue',
                Energy: 10,
                Model: 'Tesla X',
                Rate: 300,
            },
            {
                ID: 'asset3',
                Color: 'blue',
                Energy: 10,
                Model: 'Tesla X',
                Rate: 300,
            },
            {
                ID: 'asset4',
                Color: 'blue',
                Energy: 10,
                Model: 'Tesla X',
                Rate: 300,
            },
            {
                ID: 'asset5',
                Color: 'blue',
                Energy: 10,
                Model: 'Tesla X',
                Rate: 300,
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async createCar(ctx, id, color, energy, model, rate) {
        const asset = {
            ID: id,
            Color: color,
            Energy: energy,
            Model: model,
            Rate: rate,
        };

        if (asset.Energy < 10) {
          throw new Error('Must buy at least 10 energy');
        } else {
          ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
          return JSON.stringify(asset);
        }
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, color, energy, owner, rate) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
           // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            Rate: rate,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Owner = newOwner;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    // GetAllAssets returns all assets found in the world state.
    async queryAllCars(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


}

module.exports = fabcar;
