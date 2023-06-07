<template>
    <view class="kui-px-3 kui-mt-3">
        <view class="kui-w-20 kui-h-20 kui-bg-grey-0 kui-flex kui-justify-center kui-items-center kui-rounded-sm"
            @tap="onUploaderChange">
            <text class="kui-text-5xl kui-leading-none kui-grey-5">+</text>
        </view>
        <view v-if="imageURL" class="kui-mt-3">
            <text class="kui-font-extrabold">图片预览</text>
            <view class="kui-w-20 kui-h-20 kui-bg-grey-0 kui-rounded-sm kui-mt-3">
                <image :src="imageURL" />
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { Uploader, type GetOOSByACSuccessCallback, type GeneralCallbackResult } from 'lwu-upload';
import { Http, type RequestOptions } from 'lwu-request';
import { Buffer } from 'buffer';
import { ref } from 'vue';

const imageURL = ref('');

const http = new Http({
    baseUrl: {
        dev: 'http://api.kags.cn',
        pro: 'http://api.kags.cn'
    },
    takeTokenMethod: 'body',
    takenTokenKeyName: 'user_token',
    tokenValue: () => {
        return new Promise((resolve, reject) => {
            resolve('mEfJHQCyymQIH8s8aldFo6rPzrxhwQLv/CssUdrFJg0=');
        });
    }
});

const getOOSByAC = (data: object = {}, options: RequestOptions = {}) => {
    return http
        .setHeader({
            'Content-Type': 'application/json'
        })
        .get('/v1/alicloud/getAssumeRole', data, options);
};

const getSignature = (data: {
    policyBase64?: string;
    accessKeySecret?: String;
} = {}, options: RequestOptions = {}): Promise<string> => {
    return http.get('/v1/alicloud/getSignature', data, options) as Promise<string>;
};

const getOOSByACInfo = (): Promise<GetOOSByACSuccessCallback> => {
    return new Promise(async (resolve, reject) => {
        interface Result {
            code: number;
            data: {
                access_key_id: string;
                access_key_secret: string;
                expiration: string;
                security_token: string;
                [key: string]: any;
            }
        };
        const result = await getOOSByAC() as Result;
        if (result.code !== 1) {
            console.warn('获取上传配置信息失败，请稍后再试');
            return;
        }

        resolve({
            accessKeyId: result.data.access_key_id,
            accessKeySecret: result.data.access_key_secret,
            expiration: result.data.expiration,
            securityToken: result.data.security_token
        } as GetOOSByACSuccessCallback);
    });
};

const getPolicyBase64 = () => {
    let date = new Date();
    // 设置过期时间
    date.setHours(date.getHours() + 1);
    let srcT = date.toISOString();
    const policyText = {
        expiration: srcT,
        conditions: [
            // 限制上传文件大小
            ["content-length-range", 0, 15 * 1024 * 1024],
        ],
    };

    return Buffer.from(JSON.stringify(policyText)).toString('base64');
};

const getSignatureRes = (policyBase64: string, accessKeySecret: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        resolve(await getSignature({
            policyBase64: policyBase64,
            accessKeySecret: accessKeySecret
        }))
    });
};

const uploader = new Uploader({
    baseURI: {
        dev: 'https://img.kags.cn',
        pro: 'https://img.kags.cn'
    },
    debug: true
});

const onUploaderChange = () => {
    uni.chooseImage({
        success: async (res: UniApp.ChooseImageSuccessCallbackResult) => {
            console.log(res);
            try {
                const { data } = await uploader.uploadOOSSync({
                    filePath: res.tempFilePaths[0],
                    uploadDir: `static/uploads/testImg/2023-06-07/121212`,
                    // saveSuffixName: 'png',
                    // uploadImageUrl: 'http://img.kags.cn',
                    getOOSByAC: getOOSByACInfo,
                    getPolicyBase64: getPolicyBase64,
                    getSignature: getSignatureRes
                });

                setTimeout(() => {
                    if (data?.url) {
                        imageURL.value = data.url;
                    }
                }, 1000);
            } catch (e) {
                const error = e as GeneralCallbackResult;
                console.error(error);
            }
        }
    });
}
</script>