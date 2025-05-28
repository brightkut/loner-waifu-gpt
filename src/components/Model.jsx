import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';

const Model = ({ containerRef }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        window.PIXI = PIXI; // Expose PIXI globally if needed by plugin

        const init = async () => {
            // Get container dimensions
            const container = containerRef?.current || canvasRef.current.parentElement;
            const containerWidth = container?.offsetWidth || window.innerWidth;
            const containerHeight = container?.offsetHeight || window.innerHeight;

            const app = new PIXI.Application({
                view: canvasRef.current,
                autoStart: true,
                width: containerWidth,
                height: containerHeight,
                backgroundAlpha: 0,
            });

            // Handle window resize
            const handleResize = () => {
                const newWidth = container?.offsetWidth || window.innerWidth;
                const newHeight = container?.offsetHeight || 500;
                app.renderer.resize(newWidth, newHeight);

                // Reposition model if it exists
                if (app.stage.children.length > 0) {
                    const model = app.stage.children[0];
                    model.x = newWidth / 2;
                    model.y = newHeight / 2;
                }
            };

            window.addEventListener('resize', handleResize);

            const model = await Live2DModel.from('/model/21miku_idol_3.0_f_t02.model3.json', {
                ticker: PIXI.Ticker.shared,
            });

            let scale = 1.5
            const scalex = (containerWidth * scale) / model.width
            const scaley = (containerHeight * scale) / model.height

            let r = Math.min(scalex, scaley)
            // Set model properties
            model.scale.set(0.2); // Using the same scale as in the original implementation
            model.x =90;
            model.y = window.innerHeight + 115;
            model.anchor.set(1, 1);
            model.rotation = Math.PI;
            model.skew.x = Math.PI;

            app.stage.addChild(model);

            model.on('hit', (hitAreas) => {
                if (hitAreas.includes('body')) {
                    model.motion('tap_body');
                }
            });

            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
                app.destroy(true, true);
            };
        };

        const initPromise = init();

        return () => {
            // Cleanup will be handled by the returned function from init()
        };
    }, [containerRef]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Model;
