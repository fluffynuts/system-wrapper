import "expect-even-more-jest";
import { folderExists, mkdir, readTextFile } from "yafs";
import { faker } from "@faker-js/faker";
import { Sandbox } from "filesystem-sandbox";
import { Optional, TempFile, createTempFile } from "../src";

describe(`create-temp-file`, () => {
    describe(`when no contents provided`, () => {
        it(`should create a temporary file with no contents`, async () => {
            // Arrange
            // Act
            const sut = await create();
            // Assert
            expect(sut.path)
                .toBeFile();
            const contents = await readTextFile(sut.path);
            expect(contents)
                .toBeEmptyString();
            sut.destroy();
            expect(sut.path)
                .not.toBeFile();
        });
    });

    describe(`when contents provided`, () => {
        it(`should create the temp file with contents`, async () => {
            // Arrange
            // Act
            const
                expected = faker.word.words(),
                sut = await create(expected);
            // Assert
            expect(sut.path)
                .toBeFile();
            const contents = await readTextFile(sut.path);
            expect(contents)
                .toEqual(expected);
            sut.destroy();
            expect(sut.path)
                .not.toBeFile();
        });
    });

    describe(`when target folder is provided`, () => {
        it(`should use it`, async () => {
            // Arrange
            const
                sandbox = await Sandbox.create(),
                expected = faker.word.words(),
                target = sandbox.fullPathFor(faker.word.sample()),
                sut = await create(expected, target);
            // Act
            expect(sut.path)
                .toBeFile();
            expect(sut.path)
                .toEqual(target);
            const contents = await readTextFile(sut.path);
            expect(contents)
                .toEqual(expected);
            sut.destroy();
            expect(sut.path)
                .not.toBeFile();
            // Assert
        });
        afterEach(async () => {
            await Sandbox.destroyAll();
        });
    });

    async function create(
        contents?: string | Buffer,
        at?: string
    ): Promise<TempFile> {
        contents ??= "";
        return createTempFile(
            contents,
            at
        );
    }
});
