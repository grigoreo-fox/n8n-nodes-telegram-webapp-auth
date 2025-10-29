/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { type InitData, parse, validate } from "@tma.js/init-data-node";
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from "n8n-workflow";
import {
	NodeConnectionTypes,
} from "n8n-workflow";
import { cleanInitData, configuredOutputs } from "./utils";

export class TelegramWebAppAuth implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Telegram WebApp Auth",
		name: "telegramWebAppAuth",
		icon: "file:telegram.svg",
		group: ["output"],
		version: [1],
		description: "Securely validates Telegram WebApp init data",
		defaults: {
			name: "Telegram WebApp Auth",
		},
		usableAsTool: undefined,
		inputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				// eslint-disable-next-line @n8n/community-nodes/no-credential-reuse
				name: "telegramApi",
				required: true,
			},
		],
		properties: [
			{
				displayName: "Init Data",
				name: "initData",
				type: "string",
				default: "",
				description: "Init data to validate",
			},
			{
				displayName: "Additional Fields",
				name: "additionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				options: [
					{
						displayName: "Add Separat Failed Output",
						name: "addFailedOutput",
						type: "boolean",
						default: false,
						description: "Whether to add a separate failed output to the node",
					},
				],
			},
		],
		outputs: `={{(${configuredOutputs})($parameter)}}`,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials("telegramApi");
		
		const additionalFields = this.getNodeParameter("additionalFields", 0);
		const addFailedOutput = additionalFields.addFailedOutput;

		const successData: INodeExecutionData[] = [];
		const failedData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const initData = this.getNodeParameter("initData", i) as string;
			
			let parsedData: InitData;
			try {
				parsedData = parse(initData);
			
				validate(cleanInitData(initData), credentials.accessToken as string);
				successData.push({ json: { isValid: true, data: parsedData } });
			} catch (error) {
				failedData.push({
					json: { isValid: false, reason: error.message || error.name },
				})
			}
		}

		if(addFailedOutput) {
			return [successData, failedData];
		}else {
			return [successData.concat(failedData)];
		}
	}
}
