#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::thread;

use core_foundation::runloop::{kCFRunLoopCommonModes, CFRunLoop};
use core_graphics::event::{
    CGEventTap, CGEventTapLocation, CGEventTapOptions, CGEventTapPlacement, CGEventType,
};

#[derive(serde::Deserialize, Clone)]
struct Coords {
    x: i32,
    y: i32,
}

#[derive(serde::Deserialize, Clone)]
struct MacroStep {
    name: String,
    text: Option<String>,
    #[serde(rename = "clickPosition")]
    click_postion: Option<String>,
    coords: Option<Coords>,
    #[serde(rename = "pressType")]
    press_type: Option<String>,
    time: Option<i32>,
    #[serde(rename = "loopAmount")]
    loop_amount: Option<i32>,
    #[serde(rename = "loopAmountType")]
    loop_amount_type: Option<String>,
}

static HOTKEY: state::Storage<i64> = state::Storage::new();
static IS_RUNNING: state::Storage<bool> = state::Storage::new();

#[tauri::command]
fn set_hotkey(hotkey: i64) {
    println!("set hotkey: {}", hotkey);
    HOTKEY.set(hotkey);
}

fn execute_macro(steps: &Vec<MacroStep>) {
    if !*IS_RUNNING.get() {
        println!("Macro is stopped");
        return;
    }
    let mut steps_left = steps.clone();
    for step in steps {
        let name = step.name.as_str();
        match name {
            "click" => {
                // let coords = step.coords.unwrap();
                // let x = coords.x;
                // let y = coords.y;
                let click_position = step.click_postion.as_ref().unwrap();
                let press_type = step.press_type.as_ref().unwrap();
                if click_position == "mouse" {
                    println!("Press type: {}", press_type);
                } else if click_position == "custom" {
                }
            }
            "text" => {
                let text = step.text.as_ref().unwrap();
                println!("Text: {}", text);
            }
            "wait" => {
                let time = step.time.unwrap();
                println!("Sleep time: {}", time);
                thread::sleep(std::time::Duration::from_millis(time as u64));
            }
            "startloop" => {
                let steps = &steps_left
                    .iter()
                    .skip(1)
                    .take_while(|x| (**x).name != "endloop")
                    .map(|x| (*x).clone())
                    .collect::<Vec<_>>();
                if step.loop_amount_type.as_ref().unwrap() == "forever" {
                    loop {
                        execute_macro(steps);
                    }
                } else {
                    let loop_amount = step.loop_amount.unwrap();
                    for _ in 1..loop_amount {
                        execute_macro(steps);
                    }
                }
            }
            "endloop" => {}
            _ => {
                println!("Unknown macro step: {}", name);
            }
        }
        steps_left.remove(0);
    }
}

#[tauri::command]
fn start_macro(steps: Vec<MacroStep>) {
    println!("start macro");
    thread::spawn(move || {
        IS_RUNNING.set(false);
        let current = CFRunLoop::get_current();
        match CGEventTap::new(
            CGEventTapLocation::HID,
            CGEventTapPlacement::HeadInsertEventTap,
            CGEventTapOptions::ListenOnly,
            vec![CGEventType::KeyDown],
            |_a, _b, d| {
                // println!("{:?}", d.get_integer_value_field(9));
                // println!("{}", *IS_RUNNING.get());
                if d.get_integer_value_field(9) == *HOTKEY.get() {
                    if *IS_RUNNING.get() == true {
                        println!("Stopping macro");
                        IS_RUNNING.set(false);
                    } else {
                        println!("Running macro");
                        IS_RUNNING.set(true);
                        // execute_macro(&steps);
                    }
                }
                None
            },
        ) {
            Ok(tap) => unsafe {
                let loop_source = tap
                    .mach_port
                    .create_runloop_source(0)
                    .expect("Something went wrong");
                current.add_source(&loop_source, kCFRunLoopCommonModes);
                tap.enable();
                CFRunLoop::run_current();
            },
            Err(_) => (assert!(false)),
        }
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_macro, set_hotkey])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
