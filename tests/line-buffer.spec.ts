import "expect-even-more-jest";
import { LogFunction } from "../src";
import { LineBuffer } from "../src";

describe(`line-buffer`, () => {
    describe(`append`, () => {
        it(`should output the single line (UNIX eol)`, async () => {
            // Arrange
            const
                log = jest.fn(),
                sut = create(log);
            // Act
            sut.append("moo\n");
            // Assert
            expect(log)
                .toHaveBeenCalledOnceWith("moo");
        });

        it(`should output the single line (windoze eol)`, async () => {
            // Arrange
            const
                log = jest.fn(),
                sut = create(log);
            // Act
            sut.append("moo\r\n");
            // Assert
            expect(log)
                .toHaveBeenCalledOnceWith("moo");
        });

        it(`should not output incomplete lines`, async () => {
            // Arrange
            const
                log = jest.fn(),
                sut = create(log);
            // Act
            sut.append("moo\ncow");
            // Assert
            expect(log)
                .toHaveBeenCalledOnceWith("moo");
        });
    });

    describe(`flush`, () => {
        it(`should flush any remaining data`, async () => {
            // Arrange
            const
                log = jest.fn(),
                sut = create(log);
            // Act
            sut.append("moo\ncow");
            expect(log)
                .toHaveBeenCalledOnceWith("moo");
            log.mockClear();
            sut.flush();
            // Assert
            expect(log)
                .toHaveBeenCalledOnceWith("cow");
        });
    });

    function create(lineWriter: LogFunction) {
        return new LineBuffer(
            lineWriter
        );
    }
});
