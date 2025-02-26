import * as OV from "online-3d-viewer"
import { useEffect, useRef, useState } from "react"

interface Props {
  file: File | null
  url: string | null
}

const Basic3DViewer = ({ file = null, url = null }: Props) => {
  // The viewer is attached to parentDiv.current
  const parentDiv = useRef<HTMLDivElement>(null)
  // However, this really attaches the canvas element to the parentDiv, we need to also keep a reference for the viewer object itself which we'll do with viewerRef
  const viewerRef = useRef<OV.EmbeddedViewer | null>(null)
  const ifFirstLoad = useRef<boolean>(true)
  const [isRefresh, setIsRefresh] = useState<boolean>(false)

  useEffect(() => {
    if (!isRefresh) ifFirstLoad.current = true
  }, [isRefresh])

  useEffect(() => {
    // If there is a file passed in that isn't null, instantiate the viewer object
    if (file || url) {
      // Set the location of the libraries needed to load different models to lib, which in nextjs will point to "/public/libs"
      OV.SetExternalLibLocation("libs")
      // Initialize all the 3D viewer elements
      OV.Init3DViewerElements(null)
      // Before initializing the viewer, check that there isn't already a viewer object attached to viewerRef
      if (viewerRef.current === null) {
        // This is fairly self explanatory, initialize the viewer object with reasonable defaults. See the documentation for this component to see what other options you have
        const viewer = new OV.EmbeddedViewer(parentDiv.current!, {
          // camera: new OV.Camera(
          //   new OV.Coord3D(-150.0, 200.0, 300.0),
          //   new OV.Coord3D(0.0, 0.0, 0.0),
          //   new OV.Coord3D(0.0, 1.0, 0.0),
          //   45.0
          // ),
          backgroundColor: new OV.RGBAColor(255, 255, 255, 0),
          defaultColor: new OV.RGBColor(255, 255, 255),
          edgeSettings: new OV.EdgeSettings(
            false, new OV.RGBColor(255, 255, 255), 1,
          ),
          // environmentMap: [
          //   // "../website/assets/envmaps/grayclouds/posx.jpg",
          //   // "../website/assets/envmaps/grayclouds/negx.jpg",
          //   // "../website/assets/envmaps/grayclouds/posy.jpg",
          //   // "../website/assets/envmaps/grayclouds/negy.jpg",
          //   // "../website/assets/envmaps/grayclouds/posz.jpg",
          //   // "../website/assets/envmaps/grayclouds/negz.jpg",
          // ],
          onModelLoaded: () => {
            console.log(viewerRef.current!.GetViewer())
          },
        })
        // ! This feels stupid but unfortunately, this resizing event can persist after clean up and lead to an error, one way to avoid this happening is to just overwrite the method so that it doesn't call this.viewer
        // ! Ideally, you'd clean it up during cleanup but I just found it easier to replace and ignore this event instead
        viewer.Resize = () => {
          console.log("I'm not resizing")
        }

        // Here, we assign the viewer object viewerRef.current to keep hold of it for later use
        viewerRef.current = viewer

        if (file) {
          // I've found This method of loading the file into the viewer works most reliably
          // Create a new data transfer object, add a File interface to it's items, grab the files and assign them to file_list and then load the model into the viewer with them
          const dt = new DataTransfer()
          console.log(file)
          dt.items.add(file)
          const fileList = Array.from(dt.files)
          viewer.LoadModelFromFileList(fileList)
        } else if (url) {
          const splits = url.split('.')
          const ext = splits[splits.length - 1].split('?')[0]

          // Fetch and turn url to file
          // fetch(url).then(res => res.blob()).then(blob => {
          //   const fileFromUrl = new File([blob], `filename.${ext}`, { type: blob.type })
          //   // I've found This method of loading the file into the viewer works most reliably
          //   // Create a new data transfer object, add a File interface to it's items, grab the files and assign them to file_list and then load the model into the viewer with them
          //   const dt = new DataTransfer()
          //   dt.items.add(fileFromUrl)
          //   const fileList = Array.from(dt.files)
          //   console.log(fileList)
          //   viewer.LoadModelFromFileList(fileList)
          // })

          // To load a file into the viewer using the url, we first pass a file name, OV.FileSource.Url and then the url of the model to the OV.InputFile constructor, put the newly created object in an array and save it as inputFiles
          const inputFiles = [
            new OV.InputFile(`filename.${ext}`, OV.FileSource.Url, url),
          ]
          // Then we just pass inputFiles into the below method and viola
          viewer.LoadModelFromInputFiles(inputFiles)

          if (ifFirstLoad.current) {
            ifFirstLoad.current = false
            setIsRefresh((prev) => !prev)
          }
        }
      }
    }

    return () => {
      // ! We need to correctly clean up our viewer, it's listeners and related model data to ensure memory leaks don't occur
      // ! If you want to see what can happen if this isn't here, comment out this code and repeatedly spin up multiple viewers and then do a heap snapshot with chrome and you will see a massive amount of data that isn't being cleaned up by the garbage collector
      // We first check that both the viewerRef and parentDiv aren't null so we don't call a method on an object that doesn't exist
      if (viewerRef.current !== null && parentDiv.current !== null) {
        // ! I threw the kitchen sink at this to get rid of the memory leaks so some of this code is definitely redundant and there is likely a cleaner way of doing this
        // We delete the model, reset the state of the renderer and clear the viewer
        delete viewerRef.current.model
        viewerRef.current.viewer.renderer.resetState()
        viewerRef.current.viewer.Clear()
        // Then we delete the whole viewer object
        // delete viewerRef.current.viewer
        // We grab canvas element before we delete it to ensure we lose the webgl context and it doesn't persist
        const gl = viewerRef.current.canvas.getContext("webgl2")
        gl!.getExtension("WEBGL_lose_context")!.loseContext()
        // We replace the canvas element which will also replace all the event listeners which can cause the element and things associated with it to not be correctly cleaned up by the garbage collector
        const tempClone = viewerRef.current.canvas.cloneNode(true)
        viewerRef.current!.canvas!.parentNode!.replaceChild(
          tempClone,
          viewerRef.current.canvas
        )
        // Finally, we delete the canvas element and set the viewerRef.current to null, meaning everything should be properly cleaned up
        // eslint-disable-next-line react-hooks/exhaustive-deps
        parentDiv.current.removeChild(parentDiv.current.children[0])
        viewerRef.current = null
      }
    }
  }, [file, url, isRefresh])

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          width: '100%',
          height: '100%'
        }}
        ref={parentDiv}
        role={"img"}
        aria-label="Canvas showing the model in the 3D Viewer"
        className="relative flex  flex-col items-center justify-center p-2 h-72 w-72 border-2 border-black rounded-sm"
      ></div>
    </>
  )
}

export default Basic3DViewer