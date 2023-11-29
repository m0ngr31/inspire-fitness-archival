Current version: **1.0.5**

# About
This allows you to download workouts and programs from the Inspire Fitness app. I was worried that I'd lose access to the videos at some point so for archival purposes I wanted to have a copy of the videos for my machine.

# Running
The recommended way of running is to pull the image from [Docker Hub](https://hub.docker.com/r/m0ngr31/inspire-fitness-archival).

The first time you run, you'll need to include the `EMAIL` and `PASSWORD` environment variables so that it can authenticate and get the needed data.

If you don't have an Inspire Fitness account yet, you cannot create one from the mobile app, but you can from the [web app](https://app.inspirefitness.com/subscription).

It is highly recommended that you run with the `DRY_RUN` variable set so that you don't accidentally download hundreds or thousands of videos that you didn't intend to!

It will take a long time to download workouts (probably ~1GB each). If you have good bandwidth you can increase the `CONCURRENCY` variable to download more at once. If the app crashes or you cancel it, running again with the same variables will resume the download.

Alongside each workout video there will be a JSON file that contains information about the workout.

## Environement Variables
| Environment Variable | Description | Default |
|---|---|---|
| EMAIL | E-mail address associated with Inspire Fitness (Only needed the first run) | N/A |
| PASSWORD | Password for your account (Only needed the first run) | N/A |
| DRY_RUN | Set to try to try out your filters first! | False |
| CONCURRENCY | Number of workouts to download at once | 4 |

#### Search Filters
| Environment Variable | Description | Valid Options |
|---|---|---|
| MIN_MINUTES | Minimum number of minutes in a workout | 0-120 |
| MAX_MINUTES | Maximum number of minutes in a workout | 0-120 |
| FAVORITES | Filter workouts what my favorites | `True` |
| POPULAR | Only grab 'Popular' workouts (Tag is only associated with Cardio and Fusion categories) | `True` |
| IN_PROGRAM | Only grab workouts that are a part of a "program" | `True` |
| EQUIPMENT | Filter workouts by equipment. Multiple values are allowed (comma separated) | `Functional Trainer`, `Indoor Cycle`, `Rower`, `Strider`, `Free Weights`, `Multi Gym`, `Bodyweight`, `FT1/FTX`, `FT2`, `SCS`, `SF3`, `BL1`, `M1`, `M2`, `M3`, `M5` |
| INSTRUCTORS | Filter workouts by instructor(s). Multiple values are allowed (comma separated) | Instructor names |
| FUSION | Filter Fusion workouts by equipment "combo". Multiple values are allowed (comma separated) | `Functional Trainer + Indoor Cycle`, `Free Weights + Indoor Cycle`, `Free Weights + Yoga` |
| MUSIC | Filter workouts by music type | `Country`, `Disco`, `Electronic`, `Hip-Hop`, `Mellow`, `Pop`, `R&B`, `Reggae`, `Rock`, `World`, `No Music`, `Pop Rock`, `Dance`, `Latin`, `Alternative`, `Holiday`, `Rap` |
| PROGRAMS | Filter workouts by program name. Multiple values are allowed (comma separated) | Program name |
| CATEGORIES | Filter workouts by category. Multiple values are allowed (comma separated) | `Cardio`, `Strength`, `Fusion`, `Cross Train`, `Yoga` |
| INJURIES | Filter workouts by what injuries to be conscious of. Multiple values are allowed (comma separated) | `Hip`, `Knee`, `Back`, `Shoulder`, `Neck` |
| GOALS | Filter workoust by goal type Multiple values are allowed (comma separated) | `Tone & Shape`, `Lose Fat`, `Build & Define`, `Increase Strength`, `Bulk Up`, `Improve Endurance`, `Improve Health`, `Improve Flexibility`, `Improve Performance` |
| MUSCLE_GROUPS | Filter workouts by targeted muscle group | `Full`, `Upper`, `Lower` |

## Volumes
| Volume Name | Description | Required? |
|---|---|---|
| /app/config | Used to store workout data | Yes |
| /app/videos | Used to store workout videos | Yes |


## Docker Run
By default, the easiest way to get running is:

```bash
docker run -e DRY_RUN=true -v config_dir:/app/config -v video_dir:/app/videos m0ngr31/inspire-fitness-archival
```

If you run into permissions issues:

```bash
docker run -e DRY_RUN=true -v config_dir:/app/config -v video_dir:/app/videos -e PUID=$(id -u $USER) -e PGID=$(id -g $USER) m0ngr31/inspire-fitness-archival
```
